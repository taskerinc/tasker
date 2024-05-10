import { subWeeks } from 'date-fns';
import React, { JSX } from 'react';
import {
  ProjectsStatuses,
  TeamMembers,
  UpcomingTasks,
} from '@tasker/dashboard-widgets';
import { Sidebar } from '@tasker/sidebar';
import { getUserData } from '../api/auth/utils';
import { cookies } from 'next/headers';
import { db } from '@tasker/database';
import { CreateTaskButton } from '@tasker/ui/task';
import type { AssigneesOnTasks } from '@tasker/database/model';

export const metadata = {
  title: 'Dashboard | Tasker',
};

export default async function Page(): Promise<JSX.Element> {
  const cookieStore = cookies();
  const userData = getUserData(cookieStore);
  const members = await db.user.findMany();
  const projects = await db.project.findMany({
    include: {
      Task: true,
    },
  });
  const assignedTaskIds = (
    await db.assigneesOnTasks.findMany({
      where: {
        assigneeId: userData.id,
      },
    })
  ).map((a: AssigneesOnTasks) => a.taskId);
  const tasks = await db.task.findMany({
    where: {
      deleted: false,
      id: { in: assignedTaskIds },
      dueAt: { gte: subWeeks(new Date(), 1) },
    },
  });
  return (
    <div className="flex h-screen w-full">
      <div className="flex w-64 flex-col items-start justify-between border-r bg-white p-8">
        <Sidebar />
      </div>
      <div className="w-full max-w-screen-lg p-8">
        <main className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="bg-white text-gray-900">
            <UpcomingTasks tasks={tasks} />
          </div>
          {/*<div className="bg-white text-gray-900">*/}
          {/*  <TasksChart />*/}
          {/*</div>*/}
          <div className="bg-white text-gray-900">
            <ProjectsStatuses projects={projects} />
          </div>
          <div className="bg-white text-gray-900">
            <TeamMembers members={members} me={userData} />
          </div>
        </main>
      </div>
      <CreateTaskButton projects={projects} members={members} me={userData} />
    </div>
  );
}
