export class Project {
    id: string;
    name: string;
    emailToAddresses: string[];
    neighbourhood: string;
	description: string;
	address: string;
    tags: string[];

    constructor(id: string, name: string, emailToAddresses: string[], neighbourhood: string, description: string, address: string, tags: string[]){
        this.id = id;
        this.name = name;
        this.emailToAddresses = emailToAddresses;
        this.neighbourhood = neighbourhood;
        this.description = description;
        this.address = address;
        this.tags = tags;
    }
}
