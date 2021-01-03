export default abstract class Command {
  abstract exec(): void
  abstract undo(): void
}
