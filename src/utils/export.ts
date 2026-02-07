import { db } from '@/services/db';

export const exportData = async (): Promise<void> => {
  const data = {
    tasks: await db.tasks.toArray(),
    habits: await db.habits.toArray(),
    habitLogs: await db.habitLogs.toArray(),
    financialGoals: await db.financialGoals.toArray(),
    notes: await db.notes.toArray(),
    meetings: await db.meetings.toArray(),
    exportDate: new Date().toISOString(),
    version: '1.0'
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `planner-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
};

export const importData = async (file: File): Promise<void> => {
  const text = await file.text();
  const data = JSON.parse(text);

  await db.transaction('rw', [
    db.tasks,
    db.habits,
    db.habitLogs,
    db.financialGoals,
    db.notes,
    db.meetings
  ], async () => {
    // Clear existing data
    await db.tasks.clear();
    await db.habits.clear();
    await db.habitLogs.clear();
    await db.financialGoals.clear();
    await db.notes.clear();
    await db.meetings.clear();

    // Import new data
    if (data.tasks?.length) await db.tasks.bulkAdd(data.tasks);
    if (data.habits?.length) await db.habits.bulkAdd(data.habits);
    if (data.habitLogs?.length) await db.habitLogs.bulkAdd(data.habitLogs);
    if (data.financialGoals?.length) await db.financialGoals.bulkAdd(data.financialGoals);
    if (data.notes?.length) await db.notes.bulkAdd(data.notes);
    if (data.meetings?.length) await db.meetings.bulkAdd(data.meetings);
  });
};
