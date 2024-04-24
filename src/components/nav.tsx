import { UserButton } from "@clerk/nextjs";

export function Nav() {
  return (
    <nav className="fixed z-50 w-full bg-blue-800">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between p-2 text-white">
        <div className=" items-center gap-4 flex flex-row">
          <h3 className="font-extrabold text-2xl">Note-List</h3>

          <>
            <UserButton />
          </>
        </div>
      </div>
    </nav>
  );
}
