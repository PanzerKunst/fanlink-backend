export type GeoapifyFeature = {
  name?: string
  country: string
  country_code: string
  region?: string
  state: string
  county: string
  city?: string
  municipality?: string
  postcode?: string
  suburb?: string
  lon: number
  lat: number
  state_code: string
  state_COG?: string
  formatted: string
  address_line1: string
  address_line2: string
  department_COG?: string
  category: "administrative" | "populated_place"
  plus_code: string
  plus_code_short?: string
  result_type: "postcode" | "county" | "suburb"
  place_id: string
}
