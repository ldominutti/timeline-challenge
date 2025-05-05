/**
 * @typedef {import('../types').Reservation} Reservation
 */

// In-memory database simulation
const today = window.moment().format('YYYY-MM-DD');

let storedReservations = [
  {
    id: 1,
    name: 'Arenales, Ingrid Lorena',
    start: `${today} 09:00`,
    end: `${today} 10:00`,
    createdBy: 1334
  },
  {
    id: 2,
    name: 'Buitrago Lozano, Daniel Esteban',
    start: `${today} 11:00`,
    end: `${today} 12:30`,
    createdBy: 1225
  }
];

/**
 * Checks for conflicting reservations
 * @param {Omit<Reservation, 'id'>} reservationData
 * @returns {boolean} True if a conflict is found
 */
function checkForConflicts(reservationData) {
    const newStart = window.moment(reservationData.start);
    const newEnd = window.moment(reservationData.end);

    return storedReservations.some(r =>
        newStart.isBefore(window.moment(r.end)) &&
        newEnd.isAfter(window.moment(r.start))
    );
}

/**
 * Fetches all existing reservations from the server
 * @returns {Promise<Reservation[]>} Array of reservation objects
 */
export async function getExistingReservations() {
    return [...storedReservations];
}

/**
 * Creates a new reservation on the server
 * @param {Omit<Reservation, 'id'>} reservationData Reservation data without ID
 * @returns {Promise<Reservation>} The created reservation with generated ID
 * @throws {Error} If there's a conflict with existing reservation
 */
export async function createReservation(reservationData) {
    const conflictingReservation = checkForConflicts(reservationData);
    if (conflictingReservation) {
        throw new Error('Conflicto con reserva existente.');
    }

    const newReservation = {
        ...reservationData,
        id: Date.now()
    };
    storedReservations.push(newReservation);
    return newReservation;
}

/**
 * Deletes a reservation from the server
 * @param {number} reservationId ID of the reservation to delete
 * @returns {Promise<number>} ID of the deleted reservation
 * @throws {Error} If reservation is not found
 */
export async function deleteReservation(reservationId) {
    const index = storedReservations.findIndex(r => r.id === reservationId);
    if (index === -1) {
        throw new Error('Reserva no encontrada');
    }

    storedReservations.splice(index, 1);
    return reservationId;
}