const Timetable = require('../models/Timetable');
const { hasTimeOverlap } = require('../utils/timeUtils');

const detectConflicts = async ({ day, startTime, endTime, room, faculty, section, semester, excludeId }) => {
  const dayEntries = await Timetable.find({ day, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });

  const conflicts = [];

  dayEntries.forEach((entry) => {
    if (!hasTimeOverlap(startTime, endTime, entry.startTime, entry.endTime)) return;

    if (entry.room === room) {
      conflicts.push({
        type: 'ROOM_CONFLICT',
        message: `Room ${room} is already occupied`,
        withEntry: entry
      });
    }

    if (String(entry.faculty) === String(faculty)) {
      conflicts.push({
        type: 'FACULTY_CONFLICT',
        message: 'Faculty already has another class at this time',
        withEntry: entry
      });
    }

    if (entry.section === section && entry.semester === semester) {
      conflicts.push({
        type: 'SECTION_CONFLICT',
        message: 'Section already has another class at this time',
        withEntry: entry
      });
    }
  });

  return conflicts;
};

module.exports = { detectConflicts };
