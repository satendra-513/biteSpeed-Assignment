const {
    findContactsByEmailOrPhone,
    getAllLinkedContacts,
    createContact,
    updateContactToPrimary,
    updateSecondariesLinkedId,
} = require("./contact.repository");

function buildResponse(primary, allContacts) {
    const secondaries = allContacts.filter((c) => c.id !== primary.id);

    const emails = [
        primary.email,
        ...secondaries.map((c) => c.email).filter(Boolean),
    ].filter((v, i, arr) => v && arr.indexOf(v) === i);

    const phoneNumbers = [
        primary.phoneNumber,
        ...secondaries.map((c) => c.phoneNumber).filter(Boolean),
    ].filter((v, i, arr) => v && arr.indexOf(v) === i);

    return {
        contact: {
            primaryContatctId: primary.id,
            emails,
            phoneNumbers,
            secondaryContactIds: secondaries.map((c) => c.id),
        },
    };
}

async function identifyContact(email, phoneNumber) {
    const matches = await findContactsByEmailOrPhone(email, phoneNumber);

    if (matches.length === 0) {
        const newContact = await createContact({
            email: email || null,
            phoneNumber: phoneNumber || null,
            linkPrecedence: "primary",
        });
        return buildResponse(newContact, [newContact]);
    }

    const primaryCandidates = matches.filter(
        (c) => c.linkPrecedence === "primary"
    );

    const secondaries = matches.filter((c) => c.linkPrecedence === "secondary");

    const linkedPrimaryIds = secondaries
        .map((c) => c.linkedId)
        .filter(Boolean);

    let allPrimaryIds = [
        ...new Set([
            ...primaryCandidates.map((c) => c.id),
            ...linkedPrimaryIds,
        ]),
    ];

    let allContacts = matches;

    if (allPrimaryIds.length === 0 && secondaries.length > 0) {
        const extraContacts = await Promise.all(
            linkedPrimaryIds.map((id) => getAllLinkedContacts(id))
        );
        allContacts = [
            ...new Map(
                [...matches, ...extraContacts.flat()].map((c) => [c.id, c])
            ).values(),
        ];
        allPrimaryIds = allContacts
            .filter((c) => c.linkPrecedence === "primary")
            .map((c) => c.id);
    }

    if (allPrimaryIds.length > 1) {
        allContacts = (
            await Promise.all(allPrimaryIds.map((id) => getAllLinkedContacts(id)))
        ).flat();
        allContacts = [
            ...new Map(allContacts.map((c) => [c.id, c])).values(),
        ];

        const primaries = allContacts
            .filter((c) => c.linkPrecedence === "primary")
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        const winnerPrimary = primaries[0];
        const losers = primaries.slice(1);

        for (const loser of losers) {
            await updateSecondariesLinkedId(loser.id, winnerPrimary.id);
            await updateContactToPrimary(loser.id, winnerPrimary.id);
        }

        allContacts = await getAllLinkedContacts(winnerPrimary.id);
        const primary = allContacts.find((c) => c.id === winnerPrimary.id);
        return buildResponse(primary, allContacts);
    }

    const primaryId = allPrimaryIds[0];
    allContacts = await getAllLinkedContacts(primaryId);
    const primary = allContacts.find((c) => c.id === primaryId);

    const hasNewEmail =
        email && !allContacts.some((c) => c.email === email);
    const hasNewPhone =
        phoneNumber && !allContacts.some((c) => c.phoneNumber === phoneNumber);

    if (hasNewEmail || hasNewPhone) {
        await createContact({
            email: email || null,
            phoneNumber: phoneNumber || null,
            linkedId: primaryId,
            linkPrecedence: "secondary",
        });
        allContacts = await getAllLinkedContacts(primaryId);
    }

    return buildResponse(primary, allContacts);
}

module.exports = { identifyContact };
