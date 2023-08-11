export class Type {
    id: number;
    name: string;
    code: string;
    color: any;
}

export class Region {
    id: number;
    region: string;
    code: string;
    capital: string;
    territorial_organization: number;
}

export class Province {
    id: number;
    region: Region;
    province: string;
}

export class Commune {
    id: number;
    province: Province;
    commune: string;
}

export class Subsidiary {
    id: number;
    commune: Commune;
    created: Date;
    modified: Date;
    is_removed: boolean;
    name: string;
    contact: string;
    image?: any;
    address: string;
    latitude: string;
    longitude: string;
    is_active: boolean;
    parent_subsidiary?: Subsidiary;
}

export class User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

export class UserProfile {
    id: number;
    user: User;
    created: Date;
    modified: Date;
    is_removed: boolean;
    ni: number;
    check_digit: string;
    personal_email: string;
    personal_phone: string;
    sex: string;
    organization: number;
}

export interface Provider {
    id: number;
    created: Date;
    modified: Date;
    is_removed: boolean;
    name: string;
    ni: number;
    check_digit: string;
    code: string;
    description: string;
    latitude?: any;
    longitude?: any;
    website?: any;
    color: string;
    email?: any;
    contact_data: string;
    bank_account_data: string;
    image?: any;
    stamp?: any;
    address: string;
    default_commission: number;
    min_amount_service: number;
    is_public: boolean;
    is_active: boolean;
    commune?: any;
    parent_provider?: Provider;
    featured?: Featured
}

export interface Featured {
    qty_services: number;
    qty_service_period: number;
}

export interface Organization {
    id: number;
    created: Date;
    modified: Date;
    is_removed: boolean;
    name: string;
    code: string;
    logo?: any;
}

export class WorkLog {
    id: number;
    type: Type;
    created: Date;
    modified: Date;
    is_removed: boolean;
    value: string;
    description: string;
    service_order: number;
    user_created?: any;
}


export class ServiceOrder {
    id: number;
    equipments: [] = [];
    drivers: [] = [];
    contract: Contract;
    provider: Provider;
    cost_center: CostCenter = new CostCenter();
    service_date: any;
    office_guide: string = '';
    address: string = '';
    amount: any;
    priority: number;
    type: Type;
    origin: Subsidiary;
    destination: Subsidiary;
    estimated_closing_date: any;
    weight: any;
    volume: any;
    service_costs: ServiceCost[];
    work_logs: WorkLog[];
    workflow_values: WorkflowValue[]
}

export class ServiceOrderFilter {

    equipments: string;
    drivers: string;
    contract: any;
    cost_center: any;
    service_date: any;
    office_guide: string = '';
    address: string = '';
    amount: any;
    priority: number;
    estimated_closing_date: any;
    reference: string = '';
    type: any;
    origin: any;
    destination: any;
}

export class ServiceOrderInput {

    private _type: any;
    private _contract: any;
    private _cost_center: any;
    private _service_date: any;
    private _estimated_closing_date: any;
    private _equipments: any;
    private _drivers: any;
    private _is_driver: any = 0;
    private _origins: any;
    private _destinations: any;
    private _address: string = '';
    private _office_guide: string = '';
    private _priority: number;
    private _reference: string = '';
    private _service_id: number = null;
    private _weight: any;
    private _volume: any;

    constructor(){}

    public get equipments(): any {
        return this._equipments;
    }

    public set equipments(value: any) {
        let ids: any[] = [];
        if(value){
            for(let item of value){
                // console.log('obj item', item);
                // console.log(item);
                ids.push(item['id']);
            }
        }
        this._equipments = ids.join(',');
    }

    public get drivers(): any {
        return this._drivers;
    }

    public set drivers(value: any) {
        let ids: any[] = [];
        for(let item of value){
            console.log('driver', item);
            ids.push(item['id']);
        }
        this._drivers = ids.join(',');
    }

    public get type(): any {
        return this._type;
    }
    public set type(value: any) {
        this._type = (value) ? value.code : null;
    }

    public get contract(): any {
        return this._contract;
    }
    public set contract(value: any) {
        this._contract = (value) ? value.id : null;
    }

    public get cost_center(): any {
        return this._cost_center;
    }
    public set cost_center(value: any) {
        this._cost_center = (value) ? value.id : null;
    }

    public get service_date(): any {
        return this._service_date;
    }
    public set service_date(value: any) {
        this._service_date = value;
    }

    public get office_guide(): string {
        return this._office_guide;
    }
    public set office_guide(value: string) {
        this._office_guide = value;
    }

    public get origins(): any {
        return this._origins;
    }
    public set origins(value: any) {
        let id: number;
        if(value){
            for(let item of value){
                id=item.id;
            }
        }
        this._origins = id;
    }
    
    public get destinations(): any {
        return this._destinations;
    }
    public set destinations(value: any) {
        let id: number;
        if(value){
            for(let item of value){
                id=item.id;
            }
        }
        this._destinations = id;
    }
    
    public get address(): string {
        return this._address;
    }
    public set address(value: string) {
        this._address = value;
    }
    private _amount: any;
    public get amount(): any {
        return this._amount;
    }
    public set amount(value: any) {
        this._amount = value;
    }
    
    public get priority(): number {
        return this._priority;
    }
    public set priority(value: number) {
        this._priority = value;
    }
    
    public get estimated_closing_date(): any {
        return this._estimated_closing_date;
    }
    public set estimated_closing_date(value: any) {
        this._estimated_closing_date = value;
    }
    
    public get reference(): string {
        return this._reference;
    }
    public set reference(value: string) {
        this._reference = value;
    }
    
    public get service_id(): number {
        return this._service_id;
    }
    public set service_id(value: number) {
        this._service_id = value;
    }

    public get is_driver(): any {
        return this._is_driver;
    }
    public set is_driver(value: any) {
        this._is_driver = value;
    }

    public get weight(): any {
        return this._weight;
    }
    public set weight(value: any) {
        this._weight = value;
    }

    public get volume(): any {
        return this._volume;
    }
    public set volume(value: any) {
        this._volume = value;
    }
}


export class ServiceOrderSearch {

    private _start_date: string;
    private _end_date: string;
    private _equipments: any;
    private _drivers: any;
    private _contract: any;
    private _cost_center: any;
    private _is_driver: any = 0;
    private _service_order_type: any;
    private _weight: any;
    private _volume: any;
    
    constructor(){}

    public get start_date(): string {
        return this._start_date;
    }
    public set start_date(value: string) {
        this._start_date = value;
    }

    public get end_date(): string {
        return this._end_date;
    }
    public set end_date(value: string) {
        this._end_date = value;
    }

    public get equipments(): any {
        return this._equipments;
    }
    public set equipments(value: any) {
        let ids: any[] = [];
        console.log('OBJECT', value);
        if(value){
            for(let item of value){
                console.log('obj item', item);
                console.log(item);
                ids.push(item['equipment']['id']);
            }
        }
        this._equipments = ids.join(',');
    }

    public get drivers(): any {
        return this._drivers;
    }
    public set drivers(value: any) {
        let ids: any[] = [];
        for(let driver of value){
            ids.push(driver['driver']['id']);
        }
        this._drivers = ids.join(',');
    }

    public get contract(): any {
        return this._contract;
    }
    public set contract(value: any) {
        this._contract = (value) ? value.id : '';
    }

    public get cost_center(): any {
        return this._cost_center;
    }
    public set cost_center(value: any) {
        this._cost_center = (value) ? value.id : '';
    }

    public get is_driver(): any {
        return this._is_driver;
    }
    public set is_driver(value: any) {
        this._is_driver = value;
    }

    public get service_order_type(): any {
        return this._service_order_type;
    }
    public set service_order_type(value: any) {
        this._service_order_type = value;
    }

    public get weight(): any {
        return this._weight;
    }
    public set weight(value: any) {
        this._weight = value;
    }

    public get volume(): any {
        return this._volume;
    }
    public set volume(value: any) {
        this._volume = value;
    }
}


export class Contract {

    id: number;
    code: string;
}

export class CostCenter {

    id: number;
    name: string = '';
    addess: string = '';
    contact: string = '';
}

export class ActionType {

    id: number;
    code: string = '';
    description: string = '';
}

export class List {

    id: number;
    childs: List[];
    action_type: ActionType;
    created: Date;
    modified: Date;
    is_removed: boolean;
    title: string;
    code: string;
    action_value: string;
    custom_style: string;
    file?: any;
    order: number;
    application: number;
    parent_list?: any;
}

export class Application {
    id: number;
    lists: List[];
    created: Date;
    modified: Date;
    name: string;
    code: string;
    domain: string;
    repository: string;
    description: string;
    is_active: boolean;
    organization: number;
}

export class CostType {
    id: number;
    is_removed: boolean;
    code: string;
    name: string;
    color: string;
    has_double_value: boolean;
    order: number;
}


export class ServiceCost {
    id: number;
    created: Date;
    modified: Date;
    is_removed: boolean;
    value1: string;
    value2: string;
    image: string;
    observation: string;
    equipment?: number;
    service_order?: any;
    cost_type: CostType;
    user_created: number;
}

export class ServiceCostInput {
    
    value1: string;
    value2: string;
    image: string;
    observation: string;
    equipment?: number;
    service_order?: any;
    cost_type: number;
    user_created: number;
}


export class Location {
    latitude: string;
    longitude: string;
}

export interface PointObject {
    latitude: string;
    longitude: string;
    icon: string;
    info: string;
    num: string;
}

export class _LatLng {
    latitude: number;
    longitude: number;
}

export class AppFile {
    name: string;
    value: string;
}


export class CorporateEmployee {
    name: string;
    gender: string;
    company: string;
    age: number;
  
    constructor(name: string, gender: string, company: string, age: number) {
      this.name = name;
      this.gender = gender;
      this.company = company;
      this.age = age;
    }
  }


  export interface Conditions {
}

export interface FieldList {
    id: number;
    is_removed: boolean;
    key: string;
    value: string;
    default_value: string;
    title: string;
    icon: string;
    conditions: Conditions;
    type: string;
    is_visible: boolean;
    process: number;
    order: number;
    column_attr: Object;
    filter: any;
    exclude: any;
    input_value: any;
    api_list: any;
    api_context: any;
    anchor_field:any;
    css_class: any;
}

export interface WorkflowValue {
    id: number;
    is_removed: boolean;
    module: string;
    workflow_name: string;
    code: string;
    icon: string;
    description: string;
    color: string;
    order: number;
    is_active: boolean;
    subsidiaries: number[];
    viewers: number[];
    editors: number[];
    field_list: FieldList[];
}


export class Filters {
    filter: Object;
    exclude: Object;
    constructor(){}
}


