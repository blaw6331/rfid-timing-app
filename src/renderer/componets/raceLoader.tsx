import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  Header,
  Input,
  Modal,
  SpaceBetween,
} from '@cloudscape-design/components';
import RaceDashBoard from './raceDashBoard';

type Props = {};

function RaceLoader(props: Props) {
  const [raceData, setRaceData] = useState<JSON>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [raceName, setRaceName] = useState('');
  const [numberOfPasses, setNumberOfPasses] = useState('');

  const crateNewRace = (e) => {
    e.preventDefault();
    setModalVisible(true);
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('json-loaded', (arg: string) => {
      setRaceData(JSON.parse(arg));
    });
  }, []);

  const loadRace = (Event: any) => {
    Event.preventDefault();
    window.electron.ipcRenderer.sendMessage('load-json', []);

  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    window.electron.ipcRenderer.sendMessage('create-race', [raceName, numberOfPasses]);
  };

  return (
    <div>
      {raceData ? (
        <RaceDashBoard props={raceData} />
      ) : (
        <div>
          <button type="button" onClick={loadRace}>
            Load Race
          </button>
          <button type="button" onClick={crateNewRace}>
            Create New Race
          </button>
          <Modal
            onDismiss={() => setModalVisible(false)}
            visible={modalVisible}
            closeAriaLabel="Close modal"
            header="Enter The Event Details"
          >
            <form onSubmit={handleFormSubmit}>
              <Form
                variant="embedded"
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button
                      formAction="none"
                      variant="link"
                      onClick={() => setModalVisible(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary">Submit</Button>
                  </SpaceBetween>
                }
              >
                <FormField label="Event Name">
                  <Input
                    inputMode="text"
                    onChange={({ detail }) => setRaceName(detail.value)}
                    value={raceName}
                  />
                </FormField>
                <FormField label="Number of passes by the reader">
                  <Input
                    inputMode="numeric"
                    onChange={({ detail }) => setNumberOfPasses(detail.value)}
                    value={numberOfPasses}
                  />
                </FormField>
              </Form>
            </form>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default RaceLoader;
