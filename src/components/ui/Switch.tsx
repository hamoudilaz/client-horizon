import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
// import type { Mode } from '../../utils/constants';
interface SwitchesProps {
  curr: boolean;
  onChange: (checked: boolean) => void;
}

export function Switches({ curr, onChange }: SwitchesProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center' }}>
      <label style={{ fontWeight: 'bold', cursor: 'help', fontSize: '13px' }}>
        Execution mode:
      </label>

      <div>
        <Tooltip
          title={
            <span
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              Minimum of 0.001 SOL in prio fee is required for turbo mode
            </span>
          }
          placement='bottom'
          arrow
        >
          <span>
            <Switch
              checked={curr}
              onChange={(e) => onChange(e.target.checked)}
              color='success'
              sx={{
                '& .MuiSwitch-track': {
                  backgroundColor: curr ? '#4caf50' : '#ccc',
                },
              }}
            />
            <label style={{ fontWeight: 'bold', fontSize: '12px' }}>
              {curr ? '(Turbo)' : '(Standard)'}
            </label>
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
