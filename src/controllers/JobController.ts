import { Router, Response, Request, NextFunction } from 'express'
import { BaseRouter } from '../interfaces/baseRouter'
import * as JobModel  from '../models/job';
import { v4 as uuid } from "uuid";

/**
* @class JobController used to control the job route
*/
export class JobController implements BaseRouter {
    /**
    * @property basePath used as a base for routing related to the index
    */
    basePath: string = '/jobs'

    /**
    * @constructor
    */
    constructor() {

    }

    /**
    * Returns a configured router for the route
    * @returns Router
    */
    returnRouter() : Router {
        return Router()
        .get('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let jobs = await JobModel.findAllJobs();
                if(jobs.data.length === 0) res.status(404).json({message: 'No jobs in collection'})
                res.status(200).json({message:'Jobs found', jobs: jobs.data});
            } catch (error) {
                res.status(404).json({message: 'Something went wrong. Jobs not found', error: error});
                next(error);
            }
        })
        .get('/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let job = await JobModel.findJobById(req.params.id);
                if(job.data) res.status(200).json({message:'Job found', job: job.data});
            } catch (error) {
                res.status(404).json({message: 'Something went wrong. Job not found', error: error});
                next(error);
            }
        })
        .get('/title/:title', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const jobs = await JobModel.findJobByTitle(JSON.parse(decodeURIComponent(req.params.title)));
                res.status(200).json({message: 'Jobs found', jobs: jobs.data});
            } catch (error) {
                res.status(404).json({message: 'Something went wrong. Jobs not found', error: error});
                next(error);
            }
        })
        .get('/payment/:payment', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const jobs = await JobModel.findJobByPayment(JSON.parse(decodeURIComponent(req.params.payment)));
                res.status(200).json({message: 'Jobs found', jobs: jobs.data});
            } catch (error) {
                res.status(404).json({message: 'Something went wrong. Jobs not found', error: error});
                next(error);
            }
        })
        .post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let partialJob = req.body;
                partialJob.id = uuid();
                const job = await JobModel.postNewJob(partialJob);
                res.status(201).json({message:'Job created',job:job.data});
            } catch (error) {
                res.status(400).json({message: 'Something went wrong. Job not created', error:error});
                next(error);
            }
        })
        .put('/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const job = await JobModel.updateJob(req.params.id, req.body)
                res.status(200).json({message: 'Job updated', job: job.data})
            } catch (error) {
                res.status(400).json({message: 'Something went wrong. Job not updated', error:error})
                next(error)
            }
        })
        .delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const job = await JobModel.deleteJob(req.params.id);
                res.status(200).json({message:'Job deleted', job: job.data})
            } catch (error) {
                res.status(400).json({message: 'Something went wrong. Job not deleted', error:error})
            }
        })
    }
}