const getCampusBotReply = async (message) => {
  const text = (message || '').toLowerCase();

  if (text.includes('attendance')) {
    return 'Attendance module me aap subject-wise percentage dekh sakte hain. Minimum 75% maintain karna recommended hai.';
  }

  if (text.includes('assignment')) {
    return 'Assignments section me deadline aur submissions track hote hain. Late submission pe status automatically late ho jata hai.';
  }

  if (text.includes('timetable')) {
    return 'Timetable generator faculty, room, aur section conflicts detect karta hai before save.';
  }

  if (process.env.OPENAI_API_KEY) {
    return 'OpenAI integration placeholder active hai. API key set hone par advanced AI response wire ki ja sakti hai.';
  }

  return 'SmartCampus Nexus AI Assistant: aap attendance, timetable, assignments, notices, results aur complaints ke bare me puch sakte hain.';
};

module.exports = { getCampusBotReply };
