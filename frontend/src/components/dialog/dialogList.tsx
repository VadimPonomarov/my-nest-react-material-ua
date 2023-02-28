import React, {FC, memo} from 'react';

import {Box, Container, Paper} from '@mui/material';
import {v4} from 'uuid';

interface IProps {
    selectList: string[];
}

const _DialogList: FC<IProps> = (props) => {
    const {selectList} = props;
    return (
        <Box>
            <Container sx={{display: "flex", flexDirection: "column", rowGap: "3px", m: 1}}>
                {selectList.map(item =>
                    <Box key={v4()}>
                        <Paper>
                            <small>{item}</small>
                        </Paper>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export const DialogList = memo(_DialogList);