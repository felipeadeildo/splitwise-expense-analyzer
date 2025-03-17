import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSplitwise } from '@/hooks/use-splitwise'
import React from 'react'

export const GroupSelector: React.FC = () => {
  const { data, selectGroup } = useSplitwise()
  const { groups, selectedGroup } = data

  // Skip the first group (non-group expenses)
  const filteredGroups = groups.filter((group) => group.id !== 0)

  const handleGroupChange = (value: string) => {
    const groupId = parseInt(value)
    selectGroup(groupId)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Grupo de Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedGroup?.id.toString() || ''}
          onValueChange={handleGroupChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um grupo" />
          </SelectTrigger>
          <SelectContent>
            {filteredGroups.map((group) => (
              <SelectItem key={group.id} value={group.id.toString()}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}

export default GroupSelector
