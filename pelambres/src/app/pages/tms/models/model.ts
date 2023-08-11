import { ServiceOrder, User } from "src/app/models/models";

export interface Tracking {
    id: number;
    service_order: ServiceOrder;
    created: string;
    modified: string;
    latitude: string;
    longitude: string;
    user: User
}