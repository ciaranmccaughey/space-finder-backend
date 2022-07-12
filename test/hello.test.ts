import { handler } from "../services/SpacesTable/Create";


const event = {
  body: {
    location: 'Belfast'
  }
}
handler(event as any, {} as any);