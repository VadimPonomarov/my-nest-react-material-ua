import React, {memo, useEffect} from 'react';

import {Box, Container, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {motion} from "framer-motion";
import {useForm} from "react-hook-form";
import {NavLink, useNavigate} from "react-router-dom";

import {ILoginInputs} from "../../../interfaces";
import {login, useAppDispatch, useAppSelector} from "../../../storage";
import css from "../index.module.scss";


const _Login = () => {
    const {isAuth} = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {register, handleSubmit, reset, formState: {errors, isValid}, getValues} =
        useForm<ILoginInputs>({
            mode: 'onChange',
        });

    const onSubmit = (body: ILoginInputs) => {
        dispatch(login(body));
    };

    useEffect(() => {
        if (isAuth) navigate('/');
    }, [isAuth, navigate])

    return (
        <Box className={css.main}>
            <motion.form
                animate={{
                    scale: [1, 1.3, 1.3, 1, 1],
                    rotate: [0, 0, 270, 270, 0],
                }}
                transition={{duration: 2}}
                className={css.form} onSubmit={handleSubmit(onSubmit)}>
                <h2 className={css.container}>Login form</h2>
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
                <Container className={[css.input, css.container, css.textCenter].join(' ')}>
                    <Button className={css.button} disabled={!isValid} variant="outlined" type="submit">Submit</Button>
                </Container>
                <Container className={css.textCenter}>
                    <small><NavLink to={'/registration'}>Registration form</NavLink></small>
                </Container>
            </motion.form>
        </Box>
    );
};

export const Login = memo(_Login);