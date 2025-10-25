export interface TripRequest{
    budget:number;
    duration:number;
    departureCity:string;
    startDate?:Date;
    preferences?:string[];
}

export interface TripResponse{
   destination:string;
   estimatedCost:number;
   startDate?:string;
   endDate?:string;
   durationDays:number;
   image?:string;
}