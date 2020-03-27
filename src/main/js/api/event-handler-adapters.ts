import {InputBinding} from '../binding/input';
import {MonitorBinding} from '../binding/monitor';
import {UiMonitorBinding} from '../controller/ui';
import {Handler} from '../misc/emitter';
import {Folder} from '../model/folder';
import {UiControllerList} from '../model/ui-controller-list';

export type InputEventName = 'change';
export type MonitorEventName = 'update';
export type FolderEventName = InputEventName | MonitorEventName | 'fold';

/**
 * @hidden
 */
export function input<In, Out>({
	binding,
	eventName,
	handler,
}: {
	binding: InputBinding<In, Out>;
	eventName: InputEventName;
	handler: Handler;
}) {
	if (eventName === 'change') {
		const emitter = binding.emitter;
		emitter.on('change', (inputBinding: InputBinding<In, Out>, value: any) => {
			handler(inputBinding.getValueToWrite(value));
		});
	}
}

/**
 * @hidden
 */
export function monitor<In>({
	binding,
	eventName,
	handler,
}: {
	binding: MonitorBinding<In>;
	eventName: MonitorEventName;
	handler: Handler;
}) {
	if (eventName === 'update') {
		const emitter = binding.emitter;
		emitter.on('update', (monitorBinding: MonitorBinding<In>) => {
			handler(monitorBinding.target.read());
		});
	}
}

/**
 * @hidden
 */
export function folder({
	eventName,
	folder,
	handler,
	uiControllerList,
}: {
	eventName: FolderEventName;
	folder: Folder | null;
	handler: Handler;
	uiControllerList: UiControllerList;
}) {
	if (eventName === 'change') {
		const emitter = uiControllerList.emitter;
		emitter.on(
			'inputchange',
			(_: UiControllerList, inputBinding: any, value: any) => {
				handler(inputBinding.getValueToWrite(value));
			},
		);
	}
	if (eventName === 'update') {
		const emitter = uiControllerList.emitter;
		emitter.on(
			'monitorupdate',
			(_: UiControllerList, monitorBinding: UiMonitorBinding) => {
				handler(monitorBinding.target.read());
			},
		);
	}
	if (eventName === 'fold') {
		uiControllerList.emitter.on('fold', () => {
			handler();
		});
		folder?.emitter.on('change', () => {
			handler();
		});
	}
}
