import React from 'react';
import { Lead } from '@/lib/types';
import { formatDate, cn } from '@/lib/utils';
import Avatar from '@/components/common/avatar';
import StageIndicator from '@/components/common/stageIndication';
import Badge from '@/components/common/badge';
import Checkbox from '@/components/common/checkbox';
import LeadOptions from './options';

interface LeadItemProps {
  lead: Lead;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
}

export default function LeadItem({ 
  lead, 
  isSelected, 
  onSelect,
  onEditLead,
  onDeleteLead,
}: LeadItemProps) {
  const { _id, name, email, company, stage, engaged, lastContacted, initials } = lead;

  return (
    <tr className="hover:bg-gray-50">
      {/* Checkbox cell */}
      <td className="px-6 py-4 whitespace-nowrap">
        <Checkbox
          checked={isSelected}
          onChange={() => onSelect(_id)}
          aria-label={`Select ${name}`}
        />
      </td>

      {/* Name cell */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Avatar initials={initials || name.split(' ').map(n => n[0]).join('')} />
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{name}</div>
            <div className="text-sm text-gray-500">{email}</div>
          </div>
        </div>
      </td>

      {/* Company */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company}</td>

      {/* Stage */}
      <td className="px-6 py-4 whitespace-nowrap">
        <StageIndicator stage={stage} />
      </td>

      {/* Engaged status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant={engaged ? 'success' : 'default'}>
          {engaged ? 'Engaged' : 'Not Engaged'}
        </Badge>
      </td>

      {/* Last Contacted */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(lastContacted)}
      </td>

      {/* Options menu */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <LeadOptions
          lead={lead}
          onEdit={onEditLead}
          onDelete={onDeleteLead}
        />
      </td>
    </tr>
  );
}
