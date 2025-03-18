import React, { Fragment } from 'react';
import { 
  Menu, 
  MenuButton, 
  MenuItems, 
  MenuItem, 
  Transition 
} from '@headlessui/react';
import { 
  PencilIcon, 
  TrashIcon, 
  EnvelopeIcon,
  PhoneIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { Lead } from '@/lib/types';
import { cn } from '@/lib/utils';

interface LeadOptionsProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export default function LeadOptions({ lead, onEdit, onDelete }: LeadOptionsProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="flex items-center text-gray-400 hover:text-gray-600">
          <span className="sr-only">Open options</span>
          <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
        </MenuButton>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => onEdit(lead)}
                  className={cn(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'flex w-full items-center px-4 py-2 text-sm'
                  )}
                >
                  <PencilIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Edit
                </button>
              )}
            </MenuItem>

            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => window.location.href = `mailto:${lead.email}`}
                  className={cn(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'flex w-full items-center px-4 py-2 text-sm'
                  )}
                >
                  <EnvelopeIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Email
                </button>
              )}
            </MenuItem>

            <MenuItem>
              {({ active }) => (
                <button
                  className={cn(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'flex w-full items-center px-4 py-2 text-sm'
                  )}
                >
                  <PhoneIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Call
                </button>
              )}
            </MenuItem>

            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => onDelete(lead._id)}
                  className={cn(
                    active ? 'bg-gray-100' : '',
                    'flex w-full items-center px-4 py-2 text-sm text-red-600'
                  )}
                >
                  <TrashIcon className="mr-3 h-5 w-5 text-red-500" aria-hidden="true" />
                  Delete
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
