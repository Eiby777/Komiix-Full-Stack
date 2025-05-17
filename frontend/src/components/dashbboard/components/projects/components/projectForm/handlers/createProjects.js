import { getUser } from "../../../../../../../hooks/useAuth";
import { saveProject } from "../../../../../../../lib/localDB/projectDB";

const handleCreateLocalProject = async (props) => {
    const user = await getUser();
    try {
        saveProject({
            id:props.projectId,
            user:user.id,
            name:props.name,
            images:props.images,
            lastUpdated:props.lastUpdated,
            banner:props.banner
        });
    } catch (error) {
        console.error("Error creating local project:", error);
    }
};

export {
    handleCreateLocalProject
};
