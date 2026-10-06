import React from 'react';
import AdminUsersView from '@/components/admin/AdminUsersView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin – User Management | Expansio',
  description: 'Manage all registered Expansio users and their tier access.',
};

export default function AdminUsersPage() {
  return <AdminUsersView />;
}
