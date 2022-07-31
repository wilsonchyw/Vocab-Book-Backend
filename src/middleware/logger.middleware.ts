import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import LOG from "src/log"

export function Logger(req: Request, res: Response, next: NextFunction) {
    //console.log( new Date().toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" })," imcoming request");

    LOG("imcoming request",req.method,req.url)
    next();
  };