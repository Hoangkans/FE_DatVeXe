import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
export default function PlaceSelectment({ options, value, onChange, placeholder}) {
    return (
        <Autocomplete
            disablePortal
            options={options}
            getOptionLabel={(option) => option.destination}
            value={value}
            onChange={onChange}
            
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={placeholder}
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        sx: { backgroundColor: "transparent" },
                    }}
                />
            )}
        />
    );
}