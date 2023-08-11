import { AppFile, Subsidiary, WorkLog } from "src/app/models/models";
import * as _ from 'lodash';
import * as moment from "moment";

export class Component {
    id: number;
    created: Date;
    modified: Date;
    is_removed: boolean;
    create_type: string;
    code_1: string;
    code_2: string;
    qr_code: string;
    ticket: string;
    quantity: number;
    latitude: number;
    longitude: number;
    description: string;
    observation: string;
    weight: string;
    volume: string;
    width: string;
    long: string;
    height: string;
    priority: boolean;
    is_active: boolean;
    new_contract: boolean;
    processed: boolean;
    subsidiary: Subsidiary;
    subsidiary2: Subsidiary;
    location: Location;
    type: Type;
    creator_user: number;
    editor_user: number;
    files: File[];
    workflow: Workflow[];
    locations: ComponentLocation[];

    public objectExport(): any {
        let _object = {
            create_type: this.create_type,
            code_1: this.code_1,
            code_2: this.code_2,
            height: this.height,
            width: this.width,
            long: this.long,
            weight: this.weight,
            quantity: this.quantity,
            description: this.description,
            observation: this.observation,
            latitude: this.latitude,
            longitude: this.longitude,
            qr_code: this.qr_code,
            ticket: this.ticket,
            files: this.files,
            processed: this.processed,
            new_contract: this.new_contract
        }

        // if (this.id){
        //     _object['id']=this.id;
        // }

        if (this.type) {
            _object['type'] = this.type.id;
        }
        // patio
        if (this.subsidiary) {
            _object['subsidiary'] = this.subsidiary.id;
        }
        // subisidiary
        if (this.subsidiary2) {
            _object['subsidiary2'] = this.subsidiary2.id;
        }
        // location
        if (this.location) {
            _object['location'] = this.location.id;
        }

        return _object
    }

    public objectTable(dateFormat=true): any {
        let _object = {
            id: this.id,
            created: dateFormat ? moment(this.created).format('DD/MM/YYYY HH:mm') : this.created,
            modified: dateFormat ? moment(this.modified).format('DD/MM/YYYY HH:mm') : this.modified,
            code1: this.code_1,
            code2: this.code_2,
            height: this.height,
            width: this.width,
            long: this.long,
            weight: this.weight,
            quantity: this.quantity,
            description: this.description,
            observation: this.observation,
            latitude: this.latitude,
            longitude: this.longitude,
            qrcode: this.qr_code,
            priority: this.priority,
            processed: this.processed,
            new_contract: this.new_contract ? 'Sí':'No',
            locations: this.locations
            // files: this.files
        }
        _object['type'] = '';
        if (this.type) {
            _object['type'] = this.type.name;
        }
        _object['subsidiary'] = '';
        // patio
        if (this.subsidiary) {
            _object['subsidiary'] = this.subsidiary.name;
            // if(this.subsidiary.parent_subsidiary){
            //     _object['subsidiarypath'] = this.subsidiary.parent_subsidiary.name
            // }
        }
        _object['subsidiarypath'] = '';
        // subsidiary path
        if (this.subsidiary2) {
            _object['subsidiarypath'] = this.subsidiary2.name
        }

        _object['location'] = '';
        if (this.location) {
            _object['location'] = this.location.name;
        }

        if (this.type) {
            _object['type'] = this.type.name;
        }
        _object['state1'] = 'Pendiente';
        _object['state2'] = 'Pendiente';
        _object['state3'] = 'No';
        _object['public'] = 'No';
        _object['cantmel'] = '-';


        if (this.workflow) {

            let match: Workflow = this.getProcess({ 'code': 'MEL' });
            if (match) {
                if (match.state) {
                    _object['state1'] = match.state.name;
                }
                _object['cantmel'] = match.value_1;
            }
            let match2: Workflow = this.getProcess({ 'code': 'VTA' });
            if (match2) {
                if (match2.processed) {
                    _object['public'] = 'Sí';
                }

                if (match2.state) {
                    _object['state2'] = match2.state.name;
                }
            }
            let match3: Workflow = this.getProcess({ 'code': 'ROM' });
            if (match3) {
                if (match3.processed) {
                    _object['state3'] = 'Sí';
                }
            }
        }
        _object['last_location'] = null;
        try {

            let componentLocation: ComponentLocation = new ComponentLocation();
            componentLocation.created = this.created;
            componentLocation.location = this.location;
            let location = new Location()
            location.name = 'No Indicada';
            // LatLng of component
            if(this.latitude && this.longitude){
                location.latitude = this.latitude;
                location.longitude = this.longitude; 
            }
            // LatLng of subsidiary
            else if(this.subsidiary?.latitude && this.subsidiary?.longitude){
                location.latitude = Number(this.subsidiary?.latitude);
                location.longitude = Number(this.subsidiary?.longitude);
            }
            // LatLng of subsidiary2
            else{
                location.latitude = Number(this.subsidiary2?.latitude);
                location.longitude = Number(this.subsidiary2?.longitude);
            }
            
            location.subsidiary = Object.assign(new Subsidiary(), this.subsidiary);
            location.subsidiary.parent_subsidiary = this.subsidiary2;
            componentLocation.location = location;
            if(this.locations?.length > 0){
                this.locations.push(componentLocation);
            }else{
                this.locations = [componentLocation];
            }
            
            if(this.locations?.length > 0){
                _object['last_location'] = this.locations[0];
            }
                // console.log('LOCATION', componentLocation);
                // _object['last_location'] = componentLocation;
            // if (this.locations?.length > 0) {
            //     // console.log('LOCATIONS');
            //     _object['last_location'] = this.locations[0];
            // } else 
            // if (this.location) {
            //     // console.log('LOCATION', this.created);
            //     let componentLocation: ComponentLocation = new ComponentLocation();
            //     componentLocation.created = this.created;
            //     componentLocation.location = this.location;
            //     // console.log('LOCATION', componentLocation);
            //     _object['last_location'] = componentLocation;

            // }else{
            //     let componentLocation: ComponentLocation = new ComponentLocation();
            //     componentLocation.created = this.created;
            //     componentLocation.location = this.location;
            //     let location = new Location()
            //     location.name = 'No Indicada';
            //     location.latitude = this.latitude;
            //     location.longitude = this.longitude;
            //     location.subsidiary = Object.assign(new Subsidiary(), this.subsidiary);
            //     location.subsidiary.parent_subsidiary = this.subsidiary2;
            //     componentLocation.location = location
            //     // console.log('LOCATION', componentLocation);
            //     _object['last_location'] = componentLocation;
            // }

        } catch (e) {
            console.log('ex', e)
        }


        return _object
    }


    getProcess(filter: any): Workflow {
        const match: Workflow = _.find(this.workflow, filter);
        // console.log('match', match)
        return match;
    }
}

export class Location {
    id: number;
    created: Date;
    modified: Date;
    is_removed: boolean;
    name: string;
    code: string;
    description: string;
    latitude: number;
    longitude: number;
    subsidiary: Subsidiary;
}

export class Type {
    id: number;
    is_removed: boolean;
    name: string;
    code: string;
    description?: any;
    type_parent: number;
    is_active: boolean;
}

export interface Field {
    id: number;
    is_removed: boolean;
    key: string;
    value: string;
    type: string;
    default_value: string;
    process: number;
}

export class File {
    id: number;
    is_removed: boolean;
    name: string;
    value: string;
    code: string;
    is_active: boolean;
    component: number;
}

export interface Process {
    id: number;
    is_removed: boolean;
    module: string;
    code: string;
    description: string;
    order: number;
    color: string;
    is_active: boolean;
    field_list: Field[];
}

export class Workflow {
    id: number;
    created: Date;
    modified: Date;
    is_removed: boolean;
    code: string;
    value_1: string;
    value_2: string;
    description: string;
    observation: string;
    priority: boolean;
    processed: boolean;
    is_active: boolean;
    component: number;
    state: Type;
    process: Process;
    files: MetaWorkflow[];
}

export interface MetaWorkflow {
    code: string;
    id: number;
    is_active: boolean;
    key: string;
    value: string;
    workflow: number;
}

export class StatusForm {
    code: string;
    state: boolean;
    message: string;
}

export class ComponentLocation {
    id: number;
    created: Date;
    modified: Date;
    is_removed: boolean;
    observation: string;
    is_active: boolean;
    component: number;
    location: Location;
}


// Scan
export class Appointment {
    identifier: string = '';

    constructor(identifier: string) {
        this.identifier = identifier;
    }
}

export class OperationResponse {
    code: number = 0;
    message: string = '';
    exceptionDetail: string = '';
    object: any = null;
}