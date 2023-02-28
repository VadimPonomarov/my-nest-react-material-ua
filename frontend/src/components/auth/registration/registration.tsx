import React, {memo} from 'react';

import {Box, Container, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {motion} from "framer-motion"
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";

import {IRegistrationInputs} from "../../../interfaces";
import {registration, useAppDispatch, useAppSelector} from "../../../storage";
import css from '../index.module.scss'


const _Registration = () => {

    const {error} = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {register, handleSubmit, reset, formState: {errors, isValid}, getValues} =
        useForm<IRegistrationInputs>({
            mode: 'onChange',
        });
    const onSubmit = async (body: IRegistrationInputs) => {
        dispatch(await registration(body));
        if (!error) return await navigate('/login');
        reset();
    };

    return (
        <Box className={css.main}>
            <motion.form
                animate={{
                    scale: [1, 1.3, 1.3, 1, 1],
                    rotate: [0, 0, 270, 270, 0],
                }}
                transition={{duration: 2}}
                className={css.form} onSubmit={handleSubmit(onSubmit)}>
                <h2>Registration form</h2>
                <TextField
                    required
                    className={css.input}
                    label="Name"
                    variant="standard"
                    {...register("name", {
                        required: true,
                        minLength: {
                            value: 3,
                            message: "Should be at least 3 symbols"
                        },
                        maxLength: {
                            value: 10,
                            message: "Should be max 10 symbols"
                        },
                    })}
                />
                <Container className={css.error}>
                    {errors?.name && `${errors?.name?.message}`}
                </Container>
                <TextField
                    required
                    className={css.input}
                    label="Email"
                    variant="standard"
                    {...register("email", {
                        required: true,
                        pattern: {
                            value: /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/,
                            message: "Should be an email address"
                        }
                    })}
                />
                <Container className={css.error}>
                    {errors?.email && `${errors?.email?.message}`}
                </Container>
                <TextField
                    required
                    className={css.input}
                    type="password"
                    label="Password"
                    variant="standard"
                    {...register("password", {
                        required: true,
                        minLength: {
                            value: 5,
                            message: "Should be at least 5 symbols"
                        },
                        maxLength: {
                            value: 8,
                            message: "Should be max 8 symbols"
                        },
                    })}
                />
                <Container className={css.error}>
                    {errors?.password && `${errors?.password?.message}`}
                </Container>
                <TextField
                    required
                    className={css.input}
                    type="password"
                    label="Confirm password"
                    variant="standard"
                    {...register("confirmPassword", {
                        required: true,
                        minLength: {
                            value: 5,
                            message: "Should be at least 5 symbols"
                        },
                        maxLength: {
                            value: 8,
                            message: "Should be max 8 symbols"
                        },
                        validate: (value) => value === getValues("password") ? true : "Should be the same as password"
                    })}
                />
                <Container className={css.error}>
                    {errors?.confirmPassword && `${errors?.confirmPassword?.message}`}
                </Container>
                <Container className={[css.input, css.container, css.textCenter].join(' ')}>
                    <Button className={css.button} disabled={!isValid} variant="outlined" type="submit">Submit</Button>
                </Container>
            </motion.form>
        </Box>
    );
};

export const Registration = memo(_Registration);