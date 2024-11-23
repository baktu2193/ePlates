"use client";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Start({ 
    plateNumber, 
    setPlateNumber, 
    roadLegalSpacing, 
    setRoadLegalSpacing, 
    iWantFrontPlate, 
    setIWantFrontPlate, 
    iWantBackPlate, 
    setIWantBackPlate,
    className
}: { 
    plateNumber: string; 
    setPlateNumber: (value: string) => void; 
    roadLegalSpacing: boolean; 
    setRoadLegalSpacing: (value: boolean) => void; 
    iWantFrontPlate: boolean; 
    setIWantFrontPlate: (value: boolean) => void; 
    iWantBackPlate: boolean; 
    setIWantBackPlate: (value: boolean) => void;
    className?:string
}) {
    return (
        <div className={cn("",className)}>
            <h5>Your registration</h5>
            <Input 
                className="bg-white" 
                value={plateNumber} 
                onChange={(e) => setPlateNumber(e.target.value)} 
            />
            <label className="border bg-white/95 px-2 py-1 rounded-sm">
                Formatted as <span className="font-bold">{plateNumber}</span>
            </label>

            <div className=" grid gap-1">
                <label className=" font-semibold">Character Spacing</label>
                <div className="flex items-center gap-2">
                    <Switch 
                        checked={roadLegalSpacing} 
                        onCheckedChange={(value) => setRoadLegalSpacing(value)} 
                    />
                    <label>Use road legal spacing</label>
                   
                </div>
            </div>

            <div className=" grid gap-1">
                <label className=" font-semibold">FrontPlate</label>
                <div className="flex items-center gap-2">
                    <Switch 
                        checked={iWantFrontPlate} 
                        onCheckedChange={(value) => setIWantFrontPlate(value)} 
                    />
                    <label>I want front plate</label>
                   
                </div>
            </div>
            <div className=" grid gap-1">
                <label className=" font-semibold">Back Plate</label>
                <div className="flex items-center gap-2">
                    <Switch 
                        checked={iWantBackPlate} 
                        onCheckedChange={(value) => setIWantBackPlate(value)} 
                    />
                    <label>I want back plate</label>
                   
                </div>
            </div>
        </div>
    );
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function STYLE({className}:{className?:string}) {
    const [sameAsFront,setSameAsFront]=useState(true)
    return (
        <Tabs defaultValue="front" className={cn(" flex flex-col overflow-y-scroll items-stretch  rounded-sm h-full", className)} >
            <TabsList className=" grid grid-cols-2 gap-2 " >
                <TabsTrigger className=" text-lg "  value="front">FRONT <span className=" ml-2 font-extralight mt-2 text-base">STYLE</span></TabsTrigger>
                <TabsTrigger className=" text-lg " value="back">BACK  <span className="ml-2 font-extralight mt-2 text-base">STYLE</span></TabsTrigger>
                
            </TabsList>
                {/* Tabs Here */}
                <TabsContent value="front" className=" flex flex-col gap-3 col-span-2 px-2 bg-yellow rounded-sm" >
                    <div className="h-[200px] rounded-sm px-[1px] bg-black">
                        <p className="h-[140px] bg-purple-400">Image here</p>
                        <p className=" h-[60px]">Text here</p>
                    </div>
                    <div className="h-[200px] rounded-sm px-[1px] bg-white/80">
                        <p className="h-[140px] bg-purple-400">Image here</p>
                        <p className=" h-[60px]">Text here</p>
                    </div>
                    <div className="h-[200px] rounded-sm px-[1px] bg-white/80">
                        <p className="h-[140px] bg-purple-400">Image here</p>
                        <p className=" h-[60px]">Text here</p>
                    </div>
                </TabsContent>
                <TabsContent value="back" className=" flex flex-col gap-3 col-span-2 h-[390px] px-2 bg-yellow rounded-sm" >
                    <div className=" mt-2">
                        <Switch className="  mr-3 " checked={sameAsFront} onCheckedChange={(e)=>setSameAsFront(e)} />
                        <label>Same as front</label>
                    </div>

                    {
                        !sameAsFront&&
                        <div className=" flex flex-col gap-3">
                            <div className="h-[200px] rounded-sm px-[1px] bg-black">
                                <p className="h-[140px] bg-purple-400">Image here</p>
                                <p className=" h-[60px]">Text here</p>
                            </div>
                            <div className="h-[200px] rounded-sm px-[1px] bg-white/80">
                                <p className="h-[140px] bg-purple-400">Image here</p>
                                <p className=" h-[60px]">Text here</p>
                            </div>
                            <div className="h-[200px] rounded-sm px-[1px] bg-white/80">
                                <p className="h-[140px] bg-purple-400">Image here</p>
                                <p className=" h-[60px]">Text here</p>
                            </div>
                        </div>
                    }
                </TabsContent>
            
        </Tabs>
    );
}
