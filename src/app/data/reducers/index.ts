import {ActionReducer, ActionReducerMap, MetaReducer} from '@ngrx/store';
import {APP_CONFIG} from '@env/environment';
import * as Settings from '../../modules/settings/data';
import * as User from '../../modules/user/data/user';
import {localStorageSync} from 'ngrx-store-localstorage';
import * as Chart from '../../modules/chart/data';
import * as Logs from '../logs';

export interface AppState {
	settings: Settings.SettingsState;
	charts: Chart.ChartsState;
	user: User.UsersState;
	logs: Logs.LogsState;
}

export const reducers: ActionReducerMap<AppState> = {
	settings: Settings.reducer,
	charts: Chart.reducer,
	user: User.reducer,
	logs: Logs.reducer
};

export function localStorageSyncReducer(
	reducer: ActionReducer<any>
): ActionReducer<any> {
	return localStorageSync({
		keys: [
			'settings',
			{
				user: {
					encrypt: (state: string) => btoa(state),
					decrypt: (state: string) => atob(state)
				}
			}
		],
		rehydrate: true,
		removeOnUndefined: true
	})(reducer);
}

export const metaReducers: MetaReducer<AppState>[] = !APP_CONFIG.production
	? [localStorageSyncReducer]
	: [localStorageSyncReducer];

export const effects = [Settings.SettingsEffects, Chart.ChartsEffects];
