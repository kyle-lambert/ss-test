import { badRequest, serverError } from "remix-utils";
import { type ErrorResponse } from "./http";

type NamedSubaction = "_create" | "_update" | "_delete";

export async function namedSubaction(
  request: Request,
  options: {
    create: <TSchema>(data: TSchema) => void;
  }
) {
  const { create: optionsCreate } = options;

  const formData = await request.formData();
  const namedSubaction = formData.get("subaction") as NamedSubaction;

  try {
    switch (namedSubaction) {
      case "_create": {
        if (!optionsCreate) {
          return badRequest<ErrorResponse>({
            error: { name: "Undefined create handler" },
          });
        }
        return optionsCreate(formData);
      }
      default: {
        return badRequest<ErrorResponse>({
          error: {
            name: "Unhandled named subaction",
          },
        });
      }
    }
  } catch (error) {
    return serverError<ErrorResponse>({
      error: {
        name: "Server error",
      },
    });
  }
}

// import type { Response } from "@remix-run/node";
// import { badRequest } from "remix-utils";
// import type { ErrorResponse } from "./http";

// type Subaction = "create" | "update" | "delete";

// export async function branchSubaction(
//   request: Request,
//   {
//     createSubaction,
//     updateSubaction,
//     deleteSubaction,
//   }: {
//     createSubaction?: <TData>(
//       validatedData: TData
//     ) => Promise<Response> | Response;
//     updateSubaction?: <TData>(
//       validatedData: TData
//     ) => Promise<Response> | Response;
//     deleteSubaction?: <TData>(
//       validatedData: TData
//     ) => Promise<Response> | Response;
//   }
// ) {
//   const formData = await request.formData();
//   const subaction = formData.get("subaction") as Subaction;

//   switch (subaction) {
//     case "create": {
//       if (!createSubaction) {
//         throw badRequest<ErrorResponse>({
//           error: {
//             name: "Handler for create subaction is undefined",
//           },
//         });
//       }
//       return createSubaction(formData);
//     }
//     case "update": {
//       if (typeof updateSubaction !== "function") {
//         throw badRequest<ErrorResponse>({
//           error: {
//             name: "Handler for update subaction is undefined",
//           },
//         });
//       }
//       return updateSubaction(formData);
//     }
//     case "delete": {
//       if (typeof deleteSubaction !== "function") {
//         throw badRequest<ErrorResponse>({
//           error: {
//             name: "Handler for delete subaction is undefined",
//           },
//         });
//       }
//       return deleteSubaction(formData);
//     }
//     default: {
//       throw badRequest<ErrorResponse>({
//         error: {
//           name: "Unhandled form subaction",
//         },
//       });
//     }
//   }
// }
