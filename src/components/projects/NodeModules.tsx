import { FileMap } from "../../state/types";
import { useProject } from "./ProjectProvider";
import { useQuery } from "react-query";
import DeclarationFile from "../editor/DeclarationFile";

// interface PackageDeclarationsProps {
//   appName: string;
//   packageName: string;
//   project: ProjectManager;
// }

// export const PackageDeclarations = ({
//   appName,
//   packageName,
//   project,
// }: PackageDeclarationsProps) => {
//   const [fileMap, setFileMap] = useState<FileMap>({});

//   useEffect(() => {
//     project.emulator
//       .get(`/${appName}/declarations/${encodeURIComponent(packageName)}`)
//       .then(setFileMap);
//   }, [packageName]);

//   return Object.entries(fileMap).map(([path, file]) => (
//     <DeclarationFile
//       key={path}
//       path={`file:///node_modules/${packageName}/${path}`}
//       contents={file.code}
//     />
//   ));
// };

interface NodeModulesProps {
  appName: string;
}

export const NodeModules = ({ appName }: NodeModulesProps) => {
  const project = useProject();

  const query = useQuery([appName, "delcarations"], async () => {
    const fileMap: FileMap = await project.emulator.get(
      `/${appName}/declarations`
    );
    console.log(fileMap);
    return fileMap;
  });

  if (!query.data) {
    return;
  }

  return Object.entries(query.data).map(([path, file]) => (
    <DeclarationFile
      key={path}
      path={`file:///node_modules/${path}`}
      contents={file.code}
    />
  ));
};
