const { NotFoundError, BadRequestError, ConflictError } = require("../cores/error.response")
const Selector = require("../models/Selector.model")
const Source = require("../models/Source.model")

class SourceService {

    static getListSource = async () => {
        return await Source.findAll({
            attributes: ['id', 'name', 'status', 'link', 'avatar'],
            raw: true
        })
    }
    static getSourceDetail = async ({ id }) => {
        return await Source.findAll({
            where: {
                id: id
            },
            attributes: ['id', 'name', 'status', 'link', 'avatar'],
            include: {
                model: Selector,
                attributes: ['selector', 'value'],
            },
            raw: true
        });
    }
    static addNewSource = async ({ name, status, link, tagThumb, tagArti, tagRaw, tagTitle, tagDesc, tagCont, tagCate, tagDele, avatar }) => {
        const [result, created] = await Source.upsert({ name, status, link, avatar })

        if (created === false) throw new BadRequestError("Source not create failed")
        const tags = [
            { selector: "tagTitle", value: tagTitle },
            { selector: "tagThumb", value: tagThumb },
            { selector: "tagDesc", value: tagDesc },
            { selector: "tagCont", value: tagCont },
            { selector: "tagCate", value: tagCate },
            { selector: "tagDele", value: tagDele },
            { selector: "tagArti", value: tagArti },
            { selector: "tagRaw", value: tagRaw },
        ];
        const tagEntries = tags.map(tag => ({
            selector: tag.selector,
            value: tag.value,
            SourceId: result.id
        }));

        await Selector.bulkCreate(tagEntries, {
            updateOnDuplicate: ['value'],  // Cập nhật trường 'value' nếu bản ghi đã tồn tại
        });
        return result
    }
    static editSourceDetail = async (id, data) => {
        const payload = { ...data, id: id }
        const [source, created] = await Source.upsert(payload)
        if (!source) {
            throw new BadRequestError("Source is not update")
        }
        return source;
    }
    static deleteSource = async ({ id }) => {
        return await Source.destroy({
            where: {
                id: id
            }
        })
    }
    static changeStatus = async ({id, status}) => {
        return await Source.update(
            {status: status},
            {where:{id}}
        )
    }
    static changeMulti = async({ids, status})=>{
        return await Source.update(
            {status:status},
            {where:{id:ids}}
        )
    }
}
module.exports = SourceService