import { Entity } from '../entities/Entity';

export class InitializeGameEvent extends Event {
    static readonly type = 'initializegame';

    constructor() {
        super(InitializeGameEvent.type);
    }
}

export class EnterFrameEvent extends Event {
    static readonly type = 'enterframe';

    constructor() {
        super(EnterFrameEvent.type);
    }
}

export class RegisterEntityEvent extends CustomEvent<Entity> {
    static readonly type = 'registerentity';

    constructor(entity: Entity) {
        super(RegisterEntityEvent.type, { detail: entity });
    }
}

export class DeregisterEntityEvent extends CustomEvent<Entity> {
    static readonly type = 'deregisterentity';

    constructor(entity: Entity) {
        super(DeregisterEntityEvent.type, { detail: entity });
    }
}

type EventType<T> = {
    type: string;
    new(...rest: any[]): T;
}

export const isEvent = <T extends CustomEvent>(event: Event, type: EventType<T>): event is T => event.type === type.type;