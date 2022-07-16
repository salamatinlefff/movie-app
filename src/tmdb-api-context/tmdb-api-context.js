import { createContext } from 'react';

const { Provider: TmdbApiServiceProvider, Consumer: TmdbApiServiceConsumer } = createContext();

export { TmdbApiServiceProvider, TmdbApiServiceConsumer };
