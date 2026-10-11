import React from 'react';import ReactDOM from 'react-dom/client';import {BrowserRouter} from 'react-router-dom';import {registerSW} from 'virtual:pwa-register';import {App} from './app/App';import './styles/index.css'
registerSW({onNeedRefresh(){if(confirm('Uma nova versão está pronta. Atualizar agora?'))location.reload()},onOfflineReady(){console.info('devcards pronto para uso offline')}})
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>)
