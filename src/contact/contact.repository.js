const prisma = require("../db");

async function findContactsByEmailOrPhone(email, phoneNumber) {
    return prisma.contact.findMany({
        where: {
            deletedAt: null,
            OR: [
                email ? { email } : undefined,
                phoneNumber ? { phoneNumber } : undefined,
            ].filter(Boolean),
        },
    });
}

async function getAllLinkedContacts(primaryId) {
    return prisma.contact.findMany({
        where: {
            deletedAt: null,
            OR: [{ id: primaryId }, { linkedId: primaryId }],
        },
        orderBy: { createdAt: "asc" },
    });
}

async function createContact(data) {
    return prisma.contact.create({ data });
}

async function updateContactToPrimary(id, linkedId) {
    return prisma.contact.update({
        where: { id },
        data: { linkedId, linkPrecedence: "secondary", updatedAt: new Date() },
    });
}

async function updateSecondariesLinkedId(oldPrimaryId, newPrimaryId) {
    return prisma.contact.updateMany({
        where: { linkedId: oldPrimaryId, deletedAt: null },
        data: { linkedId: newPrimaryId, updatedAt: new Date() },
    });
}

module.exports = {
    findContactsByEmailOrPhone,
    getAllLinkedContacts,
    createContact,
    updateContactToPrimary,
    updateSecondariesLinkedId,
};
