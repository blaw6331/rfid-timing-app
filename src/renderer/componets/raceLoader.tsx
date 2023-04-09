import { useState } from 'react';
import RaceDashBoard from './raceDashBoard';

type Props = {};

function RaceLoader(props: Props) {
  const [raceData, setRaceData] = useState<JSON>(null);

  const crateNewRace = (e) => {
    console.log('new race');
  };

  const loadRace = (Event: any) => {
    Event.preventDefault();
    window.electron.ipcRenderer.sendMessage('load-json', []);
    window.electron.ipcRenderer.on('json-loaded', (arg: string) => {
      setRaceData(JSON.parse(arg));
    });
  };

  return (
    <div>
      {raceData ? (
        <RaceDashBoard props={raceData}/>
      ) : (
        <div>
          <button type="button" onClick={loadRace}>
            Load Race
          </button>
          <button type="button" onClick={crateNewRace}>
            Create New Race
          </button>
        </div>
      )}
    </div>
  );
}

export default RaceLoader;
