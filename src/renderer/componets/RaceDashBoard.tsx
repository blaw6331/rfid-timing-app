import { useEffect, useState } from 'react';
import Alert from '@cloudscape-design/components/alert';
import {
  Table,
  Box,
  Button,
  TextFilter,
  Header,
  Pagination,
  CollectionPreferences,
  Input,
  Container,
  Grid,
} from '@cloudscape-design/components';
import Timer from './Timer';
import TagReads from './TagReads';

type Props = {};

function RaceDashBoard(props: Props) {
  useEffect(() => {
    console.log('reload');
  });

  const handleSubmit = (currentItem: any, column: any, value: any) => {
    window.electron.ipcRenderer.sendMessage('edit-participants', [
      currentItem,
      value,
      column.id,
    ]);
  };

  const handleCellEdit = (item: any, { currentValue, setValue }) => {
    return (
      <Input
        autoFocus
        value={currentValue ?? item.name}
        onChange={(event) => {
          setValue(event.detail.value);
        }}
      />
    );
  };

  return (
    <div>
      <Alert statusIconAriaLabel="Info" type="success" header="Reader Status">
        Last read was 30 seconds ago.
      </Alert>

      <Grid gridDefinition={[{ colspan: 4 }, { colspan: 8 }]}>
        <div>
          <Timer />
          <TagReads />
        </div>

        <Table
          contentDensity="compact"
          submitEdit={handleSubmit}
          empty={
            <Box textAlign="center" color="inherit">
              <b>No resources</b>
              <Box padding={{ bottom: 's' }} variant="p" color="inherit">
                No resources to display.
              </Box>
              <Button>Create resource</Button>
            </Box>
          }
          footer={
            <Box textAlign="center">
              <Button
                onClick={() => {
                  window.electron.ipcRenderer.sendMessage(
                    'add-participant',
                    []
                  );
                }}
              >
                Add Participant
              </Button>
            </Box>
          }
          columnDefinitions={[
            {
              id: 'NameFirst',
              header: 'NameFirst',
              cell: (e) => e.NameFirst,
              sortingField: 'NameFirst',
              editConfig: {
                ariaLabel: 'NameFirst',
                editIconAriaLabel: 'editable',
                errorIconAriaLabel: 'Name Error',
                // eslint-disable-next-line react/no-unstable-nested-components
                editingCell: handleCellEdit,
              },
            },
            {
              id: 'NameLast',
              header: 'NameLast',
              cell: (e) => e.NameLast,
              sortingField: 'NameLast',
              editConfig: {
                ariaLabel: 'NameLast',
                editIconAriaLabel: 'editable',
                errorIconAriaLabel: 'Name Error',
                // eslint-disable-next-line react/no-unstable-nested-components
                editingCell: handleCellEdit,
              },
            },
            {
              id: 'BibNumber',
              header: 'Bib Number',
              cell: (e) => e.BibNumber,
              sortingField: 'BibNumber',
              editConfig: {
                ariaLabel: 'BibNumber',
                editIconAriaLabel: 'editable',
                errorIconAriaLabel: 'BibNumber Error',
                // eslint-disable-next-line react/no-unstable-nested-components
                editingCell: handleCellEdit,
              },
            },
            {
              id: 'time',
              header: 'Time',
              cell: (e) => e.time,
              editConfig: {
                ariaLabel: 'time',
                editIconAriaLabel: 'editable',
                errorIconAriaLabel: 'time Error',
                // eslint-disable-next-line react/no-unstable-nested-components
                editingCell: handleCellEdit,
              },
            },
            {
              id: 'Team',
              header: 'Team',
              cell: (e) => e.Team,
              sortingField: 'Team',
              editConfig: {
                ariaLabel: 'Team',
                editIconAriaLabel: 'editable',
                errorIconAriaLabel: 'Team Error',
                // eslint-disable-next-line react/no-unstable-nested-components
                editingCell: handleCellEdit,
              },
            },
            {
              id: 'Tag1',
              header: 'Tag1',
              cell: (e) => e.Tags[0],
              sortingField: 'Tag1',
              editConfig: {
                ariaLabel: 'Tag1',
                editIconAriaLabel: 'editable',
                errorIconAriaLabel: 'Tag1 Error',
                // eslint-disable-next-line react/no-unstable-nested-components
                editingCell: handleCellEdit,
              },
            },
            {
              id: 'Tag2',
              header: 'Tag2',
              cell: (e) => e.Tags[1],
              sortingField: 'BibNumber',
              editConfig: {
                ariaLabel: 'Tag2',
                editIconAriaLabel: 'editable',
                errorIconAriaLabel: 'Tag2 Error',
                // eslint-disable-next-line react/no-unstable-nested-components
                editingCell: handleCellEdit,
              },
            },
            {
              id: 'startTime',
              header: 'Start Time',
              cell: (e) => e.startTime,
              editConfig: {
                ariaLabel: 'start time',
                editIconAriaLabel: 'editable',
                errorIconAriaLabel: 'start time error',
                // eslint-disable-next-line react/no-unstable-nested-components
                editingCell: handleCellEdit,
              },
            },
            {
              id: 'finishTime',
              header: 'Finish Time',
              cell: (e) => e.finishTime,
              editConfig: {
                ariaLabel: 'finish time',
                editIconAriaLabel: 'editable',
                errorIconAriaLabel: 'Name Error',
                // eslint-disable-next-line react/no-unstable-nested-components
                editingCell: handleCellEdit,
              },
            },
          ]}
          items={props?.props?.Participants}
          loadingText="Loading resources"
          trackBy="name"
          visibleColumns={[
            'NameFirst',
            'NameLast',
            'BibNumber',
            'time',
            'Team',
            'Tags',
            'Tag1',
            'Tag2',
            'startTime',
            'finishTime',
          ]}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          empty={
            <Box textAlign="center" color="inherit">
              <b>No resources</b>
              <Box padding={{ bottom: 's' }} variant="p" color="inherit">
                No resources to display.
              </Box>
              <Button>Create resource</Button>
            </Box>
          }
          filter={
            <TextFilter
              filteringPlaceholder="Find resources"
              filteringText=""
            />
          }
          header={<Header>{props?.props?.EventName}</Header>}
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              preferences={{
                pageSize: 10,
                visibleContent: ['variable', 'value', 'type', 'description'],
              }}
              wrapLinesPreference={{
                label: 'Wrap lines',
                description: 'Select to see all the text and wrap the lines',
              }}
              stripedRowsPreference={{
                label: 'Striped rows',
                description: 'Select to add alternating shaded rows',
              }}
              contentDensityPreference={{
                label: 'Compact mode',
                description:
                  'Select to display content in a denser, more compact mode',
              }}
              visibleContentPreference={{
                title: 'Select visible content',
                options: [
                  {
                    label: 'Main distribution properties',
                    options: [
                      {
                        id: 'variable',
                        label: 'Variable name',
                        editable: false,
                      },
                      { id: 'value', label: 'Text value' },
                      { id: 'type', label: 'Type' },
                      {
                        id: 'description',
                        label: 'Description',
                      },
                    ],
                  },
                ],
              }}
            />
          }
        />
      </Grid>
    </div>
  );
}

export default RaceDashBoard;
