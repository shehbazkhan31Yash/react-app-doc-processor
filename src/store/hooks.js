import { useDispatch, useSelector } from 'react-redux';

// Small thin wrappers to centralize import paths and make later migration to TS easier
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;