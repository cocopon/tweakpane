import {forceCast} from '../misc/type-util';
import {
	BladeRack,
	BladeRackEvents,
} from '../plugin/blade/common/model/blade-rack';
import {Folder, FolderEvents} from '../plugin/blade/folder/model/folder';
import {InputBinding, InputBindingEvents} from '../plugin/common/binding/input';
import {
	MonitorBinding,
	MonitorBindingEvents,
} from '../plugin/common/binding/monitor';
import {
	TpChangeEvent,
	TpFoldEvent,
	TpUpdateEvent,
} from '../plugin/common/event/tp-event';
import {Emitter} from '../plugin/common/model/emitter';
import {FolderApiEvents} from './folder';
import {InputBindingApiEvents} from './input-binding';
import {MonitorBindingApiEvents} from './monitor-binding';

export type InputEventName = 'change';
export type MonitorEventName = 'update';
export type FolderEventName = InputEventName | MonitorEventName | 'fold';

export function adaptInputBinding<In, Ex>({
	binding,
	emitter,
}: {
	binding: InputBinding<In>;
	emitter: Emitter<InputBindingApiEvents<Ex>>;
}): void {
	binding.emitter.on('change', (inEv: InputBindingEvents<In>['change']) => {
		const value = inEv.sender.target.read();
		emitter.emit('change', {
			event: new TpChangeEvent(forceCast(value), binding.target.presetKey),
		});
	});
}

export function adaptMonitorBinding<T>({
	binding,
	emitter,
}: {
	binding: MonitorBinding<T>;
	emitter: Emitter<MonitorBindingApiEvents<T>>;
}): void {
	binding.emitter.on('update', (inEv: MonitorBindingEvents<T>['update']) => {
		const value = inEv.sender.target.read();
		emitter.emit('update', {
			event: new TpUpdateEvent(forceCast(value), binding.target.presetKey),
		});
	});
}

export function adaptFolder({
	emitter,
	folder,
	rack,
}: {
	emitter: Emitter<FolderApiEvents<unknown>>;
	folder?: Folder;
	rack: BladeRack;
}): void {
	rack.emitter.on('inputchange', (inEv: BladeRackEvents['inputchange']) => {
		const binding = inEv.inputBinding;
		const value = binding.target.read();
		emitter.emit('change', {
			event: new TpChangeEvent(forceCast(value), binding.target.presetKey),
		});
	});
	rack.emitter.on('monitorupdate', (inEv: BladeRackEvents['monitorupdate']) => {
		const binding = inEv.monitorBinding;
		const value = binding.target.read();
		emitter.emit('update', {
			event: new TpUpdateEvent(forceCast(value), binding.target.presetKey),
		});
	});
	rack.emitter.on('itemfold', (inEv: BladeRackEvents['itemfold']) => {
		emitter.emit('fold', {
			event: new TpFoldEvent(inEv.expanded),
		});
	});
	folder?.emitter.on('change', (inEv: FolderEvents['change']) => {
		if (inEv.propertyName !== 'expanded') {
			return;
		}
		emitter.emit('fold', {
			event: new TpFoldEvent(inEv.sender.expanded),
		});
	});
}
