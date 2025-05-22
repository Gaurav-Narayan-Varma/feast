"use client";
import { trpc } from "@/app/_trpc/client";
import MenuCard from "@/components/menus/menu-card";
import MenuForm from "@/components/menus/menu-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Menu } from "@/lib/types";
import { Cuisine } from "@feast/shared";
import { ArrowLeftIcon, Loader2, PlusIcon } from "lucide-react";
import { useState } from "react";

export default function ChefConsoleMenusPage() {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const listMenus = trpc.menus.listMenus.useQuery();

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between">
        <div className="section-title">My Menus</div>
        <Button
          leftIcon={
            isCreateMode || isEditMode ? <ArrowLeftIcon /> : <PlusIcon />
          }
          label={isCreateMode || isEditMode ? "Back to Menus" : "Create Menu"}
          onClick={() => {
            if (isCreateMode || isEditMode) {
              setIsCreateMode(false);
              setIsEditMode(false);
              setSelectedMenu(null);
            } else {
              setIsCreateMode(true);
              setIsEditMode(false);
            }
          }}
        />
      </div>

      {!isCreateMode && !isEditMode && (
        <>
          {listMenus.isLoading ? (
            <div className="text-muted-foreground flex flex-col w-full items-center justify-center h-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <>
              {listMenus.data?.menus.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-9">
                    <div className="text-muted-foreground mb-4">
                      You don't have any recipes yet
                    </div>
                    <Button
                      onClick={() => {
                        setIsCreateMode(true);
                      }}
                      label="Create Menu"
                      leftIcon={<PlusIcon />}
                    />
                  </CardContent>
                </Card>
              ) : (
                <div className="flex flex-col gap-4">
                  {listMenus.data?.menus.map((menu) => (
                    <MenuCard
                      key={menu.id}
                      menu={
                        {
                          ...menu,
                          recipes: menu.recipes.map((recipe) => ({
                            ...recipe,
                            cuisines: recipe.cuisines as Cuisine[],
                          })),
                        } as Menu
                      }
                      setIsEditMode={setIsEditMode}
                      setSelectedMenu={setSelectedMenu}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {(isCreateMode || isEditMode) && (
        <MenuForm
          setIsCreateMode={setIsCreateMode}
          setIsEditMode={setIsEditMode}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
      )}
    </div>
  );
}
