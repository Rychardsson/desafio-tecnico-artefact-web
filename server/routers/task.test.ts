import { beforeEach, describe, expect, it } from "vitest";
import { createCaller } from "../root";
import { tasks } from "../store/task";

const caller = createCaller({
  headers: new Headers(),
});

beforeEach(() => {
  tasks.splice(0, tasks.length);
});

describe("task router", () => {
  it("recusa criar uma tarefa sem título", async () => {
    await expect(
      caller.task.create({ titulo: "", descricao: undefined }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("executa o CRUD completo", async () => {
    const created = await caller.task.create({
      titulo: "Tarefa inicial",
      descricao: "Descrição inicial",
    });

    expect(created).toMatchObject({
      titulo: "Tarefa inicial",
      descricao: "Descrição inicial",
    });
    expect(created.id).toBeTypeOf("string");
    expect(created.dataCriacao).toBeInstanceOf(Date);

    const updated = await caller.task.update({
      id: created.id,
      titulo: "Tarefa atualizada",
      descricao: undefined,
    });
    expect(updated).toMatchObject({
      id: created.id,
      titulo: "Tarefa atualizada",
    });
    expect(updated.descricao).toBeUndefined();

    const listed = await caller.task.list({ limit: 10 });
    expect(listed.items).toHaveLength(1);
    expect(listed.items[0]?.titulo).toBe("Tarefa atualizada");

    const removed = await caller.task.delete({ id: created.id });
    expect(removed.id).toBe(created.id);
    expect((await caller.task.list({ limit: 10 })).items).toHaveLength(0);
  });

  it("retorna NOT_FOUND ao atualizar ou deletar uma tarefa inexistente", async () => {
    const id = crypto.randomUUID();

    await expect(
      caller.task.update({
        id,
        titulo: "Tarefa",
        descricao: undefined,
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });

    await expect(caller.task.delete({ id })).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });

  it("pagina a listagem usando o cursor", async () => {
    await caller.task.create({ titulo: "Primeira", descricao: undefined });
    await caller.task.create({ titulo: "Segunda", descricao: undefined });
    await caller.task.create({ titulo: "Terceira", descricao: undefined });

    const firstPage = await caller.task.list({ limit: 2 });
    expect(firstPage.items).toHaveLength(2);
    expect(firstPage.nextCursor).toBeTruthy();

    const secondPage = await caller.task.list({
      limit: 2,
      cursor: firstPage.nextCursor,
    });
    expect(secondPage.items).toHaveLength(1);
    expect(secondPage.nextCursor).toBeNull();
  });
});
