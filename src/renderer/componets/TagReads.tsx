import {
  Box,
  Button,
  Container,
  Header,
  Table,
} from '@cloudscape-design/components';
import React, { useEffect, useState } from 'react';
import useTimer from 'renderer/hooks/useTimer';

type Props = {};

export default function TagReads({}: Props) {
  const [reads, setReads] = useState([]);
  useEffect(() => {
    window.electron.ipcRenderer.on('tagRead', (args: string) => {
      const [name, bib, epc, time] = args;
      //window.electron.ipcRenderer.sendMessage('calculate-time', []);

      let oldReads = reads.filter((el) => {
        const currentTime = new Date();
        const oldTime = new Date(el.time);
        return (currentTime.getTime() - oldTime.getTime()) / 1000 < 40;
      });

      setReads([{ name, bib, epc, time }, ...oldReads]);
      console.log(reads);
    });
  }, [reads]);

  return (
    <Table
      contentDensity="compact"
      columnDefinitions={[
        {
          id: 'Name',
          header: 'Name',
          cell: (item) => item.name || '-',
          sortingField: 'name',
        },
        {
          id: 'Bib',
          header: '#',
          cell: (item) => item.bib || '-',
          sortingField: 'alt',
        },
        {
          id: 'Tag',
          header: 'Tag EPC',
          cell: (item) => item.epc || '-',
        },
      ]}
      items={reads}
      loadingText="Loading resources"
      sortingDisabled
      empty={
        <Box textAlign="center" color="inherit">
          <Box padding={{ bottom: 's' }} variant="p" color="inherit">
            No Recent Reads
          </Box>
        </Box>
      }
      footer={
        <Button
          onClick={() => {
            setReads([]);
          }}
        >
          Clear
        </Button>
      }
      header={<Header> Recent Reads </Header>}
    />
  );
}
