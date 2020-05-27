import {InputBinding, InputBindingEvents} from '../binding/input';
import {MonitorBinding, MonitorBindingEvents} from '../binding/monitor';
import {Folder, FolderEvents} from '../model/folder';
import {
	UiControllerList,
	UiControllerListEvents,
} from '../model/ui-controller-list';

type InputEventName = 'change';
type MonitorEventName = 'update';
type FolderEventName = InputEventName | MonitorEventName | 'fold';

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
	handler: (value: unknown) => void;
}) {
	if (eventName === 'change') {
		const emitter = binding.emitter;
		emitter.on('change', (ev: InputBindingEvents<In, Out>['change']) => {
			handler(ev.sender.getValueToWrite(ev.rawValue));
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
	handler: (value: unknown) => void;
}) {
	if (eventName === 'update') {
		const emitter = binding.emitter;
		emitter.on('update', (ev: MonitorBindingEvents<In>['update']) => {
			handler(ev.sender.target.read());
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
	handler: (value?: unknown) => void;
	uiControllerList: UiControllerList;
}) {
	if (eventName === 'change') {
		const emitter = uiControllerList.emitter;
		emitter.on('inputchange', (ev: UiControllerListEvents['inputchange']) => {
			// TODO: Find more type-safe way
			handler((ev.inputBinding.getValueToWrite as any)(ev.value));
		});
	}
	if (eventName === 'update') {
		const emitter = uiControllerList.emitter;
		emitter.on(
			'monitorupdate',
			(ev: UiControllerListEvents['monitorupdate']) => {
				handler(ev.monitorBinding.target.read());
			},
		);
	}
	if (eventName === 'fold') {
		uiControllerList.emitter.on(
			'fold',
			(ev: UiControllerListEvents['fold']) => {
				handler(ev.expanded);
			},
		);
		folder?.emitter.on('change', (ev: FolderEvents['fold']) => {
			handler(ev.expanded);
		});
	}
}
