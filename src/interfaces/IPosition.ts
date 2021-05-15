import { IPoint } from "./GeoInterFaces"

export default interface IPosition {
  lastUpdated: Date,
  email: string,
  name: string,
  location: IPoint
}