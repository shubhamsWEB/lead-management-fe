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
    <Menu as="div" className="relative inline-block text-left" aria-label="Lead Options">
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
        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white focus:outline-none p-[1px] shadow-lg border border-gray-200">
          <div className="py-1 relative bg-white rounded-md">
            <div className="absolute -top-2.5 right-3 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-200"></div>
            <div className="absolute -top-[3px] right-[13px] w-3 h-3 bg-white transform rotate-45"></div>
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
