import { useProject } from "./ProjectProvider";
import { useQuery } from "react-query";
import AutoImportFile from "../editor/AutoImportFile";

interface PackageImportsProps {
  appName: string;
}

const PackageImports = ({ appName }: PackageImportsProps) => {
  const project = useProject();

  const query = useQuery(
    [appName, "imports"],
    async () => {
      const importMap = await project.emulator.get(`/${appName}/imports`);
      return importMap;
    },
    {
      staleTime: Infinity,
    }
  );

  if (!query.data) {
    return;
  }

  return Object.entries(query.data).map(
    ([packageName, data]: any) =>
      data && (
        <AutoImportFile
          key={packageName}
          path={data.path}
          contents={data.contents}
          aliases={[packageName]}
        />
      )
  );
};

export default PackageImports;
