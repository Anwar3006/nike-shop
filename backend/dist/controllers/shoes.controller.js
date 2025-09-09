import { catchAsync } from "../errors/errorHandler.js";
import { ShoesService } from "../services/shoe.service.js";
export const ShoesController = {
    createShoe: catchAsync(async (req, res, next) => {
        const data = req.body;
        const newShoe = await ShoesService.createShoe(data);
        res.status(201).json(newShoe);
    }),
    updateShoe: catchAsync(async (req, res, next) => {
        const shoeId = req.params.id;
        const data = req.body;
        const updatedShoe = await ShoesService.updateShoe(shoeId, data);
        res.status(200).json(updatedShoe);
    }),
    deleteShoe: catchAsync(async (req, res, next) => {
        const shoeId = req.params.id;
        const deletedShoe = await ShoesService.deleteShoe(shoeId);
        res.status(200).json(deletedShoe);
    }),
    getShoeById: catchAsync(async (req, res, next) => {
        const shoeId = req.params.id;
        const shoe = await ShoesService.getShoeById(shoeId);
        res.status(200).json({ success: true, data: shoe });
    }),
    getShoeBySlug: catchAsync(async (req, res, next) => {
        const slug = req.params.slug;
        const shoe = await ShoesService.getShoeBySlug(slug);
        res.status(200).json({ success: true, data: shoe });
    }),
    getAllShoes: catchAsync(async (req, res, next) => {
        const shoes = await ShoesService.getShoes(req.query);
        res.status(200).json({ success: true, ...shoes });
    }),
};
