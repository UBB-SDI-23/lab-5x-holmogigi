import React, { useState } from 'react';
import {
    Autocomplete,
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { Container } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { BACKEND_API_URL } from '../constants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios, { AxiosError } from 'axios';
import { debounce } from 'lodash';
import { getAuthToken } from '../auth';

export const AIModel: React.FC = () => {
    const navigate = useNavigate();
    const [division, setDivision] = useState('');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [result, setResult] = useState('');

    const handleDivisionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setDivision(event.target.value as string);
    };

    const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAge(event.target.value);
    };

    const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHeight(event.target.value);
    };

    const handleButtonClick = () => {
        // Make the API request
        fetch(`${BACKEND_API_URL}/api/AiModel/${division}/${age}/${height}`)
            .then((response) => response.json())
            .then((data) => setResult(data))
            .catch((error) => console.error(error));
    };

    return (
        <Container>
            <div>
                <br />
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        <Typography variant="h2" gutterBottom>
                            !Weight Prediction for a bodybuilder!
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        <Typography variant="h6" gutterBottom>
                            This was done using Machine Learning and training a model on an 800k rows CSV file.<br />
                        </Typography>
                    </Grid>
                </Grid>
                <br />
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        <Typography variant="h6" gutterBottom>
                            Algorithm used: Fast Forest Regression<br />
                            Training time: 600 seconds<br />
                        </Typography>
                    </Grid>
                </Grid>
                <br />
                <br />
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        <FormControl>
                            <InputLabel id="division-label">Division</InputLabel>
                            <Select
                                labelId="division-label"
                                value={division}
                                /* @ts-ignore */
                                onChange={handleDivisionChange}
                            >
                                <MenuItem value="Men_Classic_Physique">Men Classic Physique</MenuItem>
                                <MenuItem value="Men_Bodybuilding">Men Bodybuilding</MenuItem>
                                <MenuItem value="Women_Bodybuilding">Women Bodybuilding</MenuItem>
                                <MenuItem value="Women_Physique">Women Physique</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField value={age} onChange={handleAgeChange} label="Age" type="number" />
                        <TextField value={height} onChange={handleHeightChange} label="Height" type="number" />
                    </Grid>
                </Grid>
                <br />
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        <Button variant="contained" onClick={handleButtonClick}>
                            Get Weight Prediction
                        </Button>
                    </Grid>
                </Grid>
                <br />
                <br />
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        {result && (
                            <Typography variant="h4" gutterBottom>
                                Weight: {result} kg
                            </Typography>
                        )}
                    </Grid>
                </Grid>
                <br />
                <br />
                <br />     

                {/* Table */}
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        <Grid container justifyContent="center" alignItems="center">
                            <Grid item>
                                <Typography variant="h4" gutterBottom>
                                    Realistic Inputs
                                </Typography>
                            </Grid>
                        </Grid>
                        <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Division</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Height (in cm)</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Age</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>Men Classic Physique</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>170-200</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>18-40</td>
                                </tr>
                                <tr>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>Men Bodybuilding</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>170-210</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>18-45</td>
                                </tr>
                                <tr>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>Women Bodybuilding</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>155-170</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>18-35</td>
                                </tr>
                                <tr>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>Women Physique</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>160-170</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>18-30</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3} style={{ border: '1px solid black', padding: '8px' }}>
                                        <strong>Note:</strong> The provided ranges are for reference purposes only and may vary for specific cases.
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
};