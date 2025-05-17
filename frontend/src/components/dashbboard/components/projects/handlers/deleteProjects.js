import { getUser } from "../../../../../hooks/useAuth";
import { deleteLocalProject } from "../../../../../lib/localDB/projectDB";

const handleDeleteProject = async (projectId, removeProject) => {
    try {
        const user = await getUser();
        await deleteLocalProject(projectId, user.id);
        removeProject(projectId);
    } catch (error) {
        console.error("Error deleting project:", error);
    }
};


export {
    handleDeleteProject
};
