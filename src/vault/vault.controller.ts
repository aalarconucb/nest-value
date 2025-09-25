
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { VaultService } from "./vault.service";
import { CreateEntryDto } from "./dto/create-entry.dto";
import { UpdateEntryDto } from "./dto/update-entry.dto";

@ApiTags("vault")
@Controller("vault")
export class VaultController {
  constructor(private vault: VaultService) {}

  @Post()
  create(@Body() dto: CreateEntryDto) {
    return this.vault.createEntry(dto.master, dto.name, dto.username, dto.password);
  }

  @Get()
  list() {
    return this.vault.listEntries();
  }

  @Get(":id")
  getOne(@Param("id") id: string, @Query("master") master: string) {
    return this.vault.getEntryDecrypted(id, master);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateEntryDto) {
    return this.vault.updateEntry(id, dto.master, { name: dto.name, username: dto.username, password: dto.password });
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.vault.deleteEntry(id);
  }
}
