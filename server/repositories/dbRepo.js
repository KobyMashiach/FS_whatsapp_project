
const getAll = (Model) => {
    return Model.find();
}

const getById = (Model, id) => {
    return Model.findById(id);
}

const add = (Model, obj) => {
    const document = new Model(obj);
    return document.save();
}

const update = (Model, id, obj) => {
    return Model.findByIdAndUpdate(id, obj, { new: true });
}

const remove = (Model, id) => {
    return Model.findByIdAndDelete(id);
}


module.exports = {
    getAll,
    getById,
    add,
    update,
    remove,
}